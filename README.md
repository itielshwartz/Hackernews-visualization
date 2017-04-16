asyncio-hn
==========

A simple asyncio wrapper to download
`hacker-news <https://news.ycombinator.com/>`__ with speed and ease.

The package supports all endpoints of the official API : `hacker-news
API <https://github.com/HackerNews/API>`__

Installation
------------

.. code:: shell

    pip install asyncio-hn

Usage
-----

.. code:: python

    import asyncio
    from asyncio_hn import ClientHN

    async def main(loop):
        # We init the client - extension of aiohttp.ClientSession
        async with ClientHN(loop=loop) as hn:
            # Up to 500 top and top stories (only ids)
            hn_new_stories = await hn.top_stories()
            # Download top 10 story data
            top_posts = await hn.items(hn_new_stories[:10])
            # Download the user data for each story
            users = await hn.users([post.get("by") for post in top_posts])


    if __name__ == '__main__':
        loop = asyncio.get_event_loop()
        loop.run_until_complete(main(loop))

Advance usage
~~~~~~~~~~~~~

Using this config you can reach 1000+ request/sec.

.. code:: python
    import aiohttp
    from asyncio_hn import ClientHN
    
    N = 1_000_000

    async def advance_run(loop):
        # We init the client - extension of aiohttp.ClientSession
        conn = aiohttp.TCPConnector(limit=1000, loop=loop)
        async with ClientHN(loop=loop, queue_size=1000, connector=conn, progress_bar=True, debug=True) as hn:
            # Download the last 1,000,000 stories
            hn_new_stories = await hn.last_n_items(n=N)

Output example:
---------------

Item:

.. code:: python

    item = {'by': 'amzans', 'descendants': 25, 'id': 13566716,
                    'kids': [13567061, 13567631, 13567027, 13567055, 13566798, 13567473], 'score': 171, 'time': 1486210548,
                    'title': 'Network programming with Go (2012)', 'type': 'story',
                    'url': 'https://jannewmarch.gitbooks.io/network-programming-with-go-golang-/content/'},
                   {'by': 'r3bl', 'descendants': 1, 'id': 13567940, 'kids': [13568249], 'score': 24, 'time': 1486230224,
                    'title': 'YouTube removes hundreds of the best climate science videos from the Internet',
                    'type': 'story',
                    'url': 'http://climatestate.com/2017/02/03/youtube-removes-hundreds-of-the-best-climate-science-videos-from-the-internet/'}

User:

.. code:: python

    user = {'created': 1470758993, 'id': 'amzans', 'karma': 174,
            'submitted': [13567884, 13566716, 13566699, 13558456, 13539270, 13539151, 13514498, 13418469, 13417725,
                          13416562, 13416097, 13416034, 13415954, 13415894, 13395310, 13394996, 13392554, 12418804,
                          12418361, 12413958, 12411992, 12411732, 12411546, 12262383, 12255593]}

