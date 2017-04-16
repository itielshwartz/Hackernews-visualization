from asyncio_hn import ClientHN

available_stories = {
    "hot": lambda hn: hn.top_stories,
    "new": lambda hn: hn.new_stories,
    "best": lambda hn: hn.best_stories
}


async def update_top_posts_with_descendants(hn, posts, levels_to_download):
    '''
    :param hn: asyncio_hn client
    :param posts: dict {id : story}
    :param levels_to_download:how many level down the post comment to load
    :return: only update the posts dict
    '''
    current_level_posts = posts.values()
    for i in range(levels_to_download):
        kids_ids = [kid for story in current_level_posts for kid in
                    story.get("kids", [])]  # extract all kids from all posts
        current_level_posts = []
        if kids_ids:
            for post in await hn.items(kids_ids):  # download all kids stories
                if post:
                    post["group"] = posts.get(post.get("parent")).get(
                        "group")  # post group is same for all decendend of same parent
                    posts[post.get("id")] = post
                    current_level_posts.append(post)


async def get_top_posts_with_descendants_and_users(n=10, descendants_level=3, story_type="hot"):
    '''
    :param story_type: hot/new/best
    :param n: how many top stories to download
    :param descendants_level: how much comments level download
    :return:{id:story} the top stories + the kids
    '''
    async with ClientHN() as hn:
        func = available_stories[story_type](hn)
        hn_new_stories = await func()
        hn_new_stories = hn_new_stories if isinstance(hn_new_stories, list) else []  # in case server error
        return await get_posts_and_descendants(descendants_level, hn, hn_new_stories[:n])


async def get_story_with_descendants(story_id, descendants_level=7):
    async with ClientHN() as hn:
        return await get_posts_and_descendants(descendants_level=descendants_level, hn_client=hn, stories=[story_id])


async def get_posts_and_descendants(descendants_level, hn_client, stories):
    posts = {}
    for post in await hn_client.items(stories):  # get the stories
        if post:
            post["group"] = post.get("id")  # the post group is the max parent
            posts[post.get("id")] = post
    await update_top_posts_with_descendants(hn_client, posts, descendants_level)
    users = {user.get("id"): user for user in
             await hn_client.users(set([post.get("by") for post in posts.values() if post.get("by")]))}
    return posts, users
