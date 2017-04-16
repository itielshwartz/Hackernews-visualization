from collections import defaultdict


def update_post(post, group_by_id=False):
    # update the fields needed for the vis.js graph
    post["value"] = post.get("score") or 1
    post["title"] = post.get("title") or post.get("id")
    post["shape"] = "triangle" if post.get("type") == "comment" else "dot"
    post["post_url"] = "https://news.ycombinator.com/item?id={}".format(post.get("id"))
    post["group"] = post.get("id") if group_by_id else post.get("group")
    post["value"] = len(post.get("kids", [])) if group_by_id else post.get("value")
    return post


def update_user(user):
    if user:
        user["user_url"] = "https://news.ycombinator.com/user?id={}".format(user.get("id"))
    return user


def create_edge_for_same_user(users_to_post, users):
    edges = []
    for user, stories in users_to_post.items():
        for i in range(len(stories)):
            for j in range(i + 1, len(stories)):
                edges.append(
                    {"from": stories[i], "to": stories[j], "title": user, "dashes": [5, 5], "color": "black",
                     "user": update_user(users.get(user))})
    return edges


def create_vis_js_nodes(posts, users, group_by_id=False):
    edges, nodes, users_to_post = [], [], defaultdict(list)
    for post in posts.values():
        nodes.append(update_post(post, group_by_id))
        for kid_id in post.get("kids", []):
            if kid_id in posts:
                kid_story_by_id = posts.get(kid_id).get("by")
                edges.append({"from": post.get("id"), "to": kid_id, "user": update_user(users.get(kid_story_by_id)),
                              })
        if post.get("by"):
            users_to_post[post.get("by")].append(post.get("id"))
    return edges, nodes, users_to_post
