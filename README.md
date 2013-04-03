## andthen

Async function composition with parameter fixing abiliy.

```bash
$ npm install andthen
```

See Also: [comp](http://github.com/azer/comp)

### Usage

Functions almost same as other function composition libraries, except that it lets you bind a property of a produced value to following function.

Simplest usage could look like:

```js

andThen = require('andthen')

andThen(getContents, 'posts', getPosts, 'images', getImages)(function(error, contents){

    contents.posts
    // => ['Foo', 'bar', 'qux']

    contents.images
    // => ['11.jpg', '7.jpg', '3.jpg']

})

function getContents(callback){
    callback(undefined, { posts: [3, 1, 4], images: [11, 7, 3])
}

function getPosts(ids, callback){
    callback(undefined, ['Foo', 'bar', 'qux'])
}

function getImages(ids, callback){
    callback(undefined, ['11.jpg', '7.jpg', '3.jpg'])
}

```

More detailed example with full functional programming armory:

```js

andThen   = require('andThen')
map       = require('map')
partial   = require('new-partial')

getPosts  = partial(map, getPost)
getPhotos = partial(map, getPhoto)

getProfile = andThen(getUser, 'posts', getPosts, 'photos', getPhotos)

getProfile(1, function(error, profile){

    profile.posts[0].title, profile.posts[2].content
    // => Post #1, Content #5

    profile.photos[0].path, profile.photos[1].path
    // => /photos/2.jpg, /photos/7.jpg

})

function getUser(id, callback){

  callback(undefined, {
      name   : 'Smith',
      posts  : [1, 3, 5],
      photos : [2, 7, 11]
  })

}

function getPost(id, callback){

    callback(undefined, {
        title: 'Post #' + id,
        content: 'Content #' + id
    })

}

function getPhoto(id, callback){

    callback(undefined, {
        path: '/photos' + id + '.jpg
    })

}

```

![](http://distilleryimage2.s3.amazonaws.com/3e14d1ae8e4711e2af7822000a1fb04e_6.jpg)
