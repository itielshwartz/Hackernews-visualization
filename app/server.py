import asyncio
import os
import ujson
from lru import LRU

from sanic import Sanic, response
from sanic.exceptions import ServerError
from sanic.log import log

from app.utils.fetcher import get_story_with_descendants, get_top_posts_with_descendants_and_users
from app.utils.vis import create_vis_js_nodes, create_edge_for_same_user

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(CURRENT_DIR, "current.json")) as f:
    log.info("Starting - local cache exist")
    stories_graph_by_type = ujson.load(f)

stories_cache = LRU(200)  # Create an LRU container that can hold 200 items

app = Sanic()


@app.route('/story/<story_id>')
async def graph(request, story_id):
    '''
    :param request:
    :return: json containing hn top stories and comments - {nodes:posts,edges:realtion between stories}
    '''
    if story_id:
        cached_story = stories_cache.get(story_id, None)
        if cached_story:
            return response.json(cached_story)
        else:
            posts, users = await get_story_with_descendants(story_id)
            log.info("Downloading %s please wait", story_id)
            edges, nodes, users_to_post = create_vis_js_nodes(posts, users, group_by_id=True)
            edges.extend(create_edge_for_same_user(users_to_post, users))
            story_graph = {"nodes": nodes, "edges": edges, "number_of_stories": 1}
            stories_cache[story_id] = story_graph  # Update an item
            return response.json(story_graph)
    raise ServerError("Please add the story_id param", status_code=400)


@app.route('/stories/<story_type>')
async def post_handler(request, story_type):
    return response.json(stories_graph_by_type[story_type])


async def graph_cron(number_of_posts=15, sleep_interval=500, descendants_level=4, stories_to_download=["hot"]):
    while True:
        log.info("Cron is starting")
        for story_type in stories_to_download:
            log.info("Starting to download - %s" % story_type)
            posts, users = await get_top_posts_with_descendants_and_users(n=number_of_posts,
                                                                          descendants_level=descendants_level,
                                                                          story_type=story_type)
            log.info("Post and users downland finished for %s - updating graph" % story_type)
            edges, nodes, users_to_post = create_vis_js_nodes(posts, users)
            edges.extend(create_edge_for_same_user(users_to_post, users))
            stories_graph_by_type[story_type] = {"nodes": nodes, "edges": edges,
                                                 "number_of_stories": number_of_posts}
        log.info("Sleep for %s", sleep_interval)
        await asyncio.sleep(sleep_interval)


app.static('/static', CURRENT_DIR + '/static')
app.static('/', CURRENT_DIR + '/static/index.html')

if __name__ == "__main__":
    app.add_task(
        graph_cron(number_of_posts=5, sleep_interval=60 * 60, descendants_level=3, stories_to_download=["best"]))
    app.add_task(graph_cron(number_of_posts=15, sleep_interval=60, descendants_level=3, stories_to_download=["hot"]))
    app.add_task(graph_cron(number_of_posts=100, sleep_interval=10, descendants_level=4, stories_to_download=["new"]))
    app.run('0.0.0.0', port=8000, debug=True)
