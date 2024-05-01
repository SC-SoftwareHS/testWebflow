var api_uri = 'https://locknowwebsite.azurewebsites.net/wp-json/wp/v2/posts'
var blogList = document.getElementById('blogs-list')
var searchInput = document.getElementById('search-input')
var searchBtn = document.getElementById('search-btn')

document.addEventListener('DOMContentLoaded', async function (e) {
  try {
    var res = await fetch(api_uri)
    var data = await res.json()
    renderBlogs(data)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  }
})

function renderBlogs(data) {
  data.forEach(async function (blog) {
    let {
      title,
      excerpt,
      featured_media,
    } = blog

    let img = await getImage(featured_media).catch(error => console.error('Failed to fetch image:', error))
    let div = document.createElement('div')
    div.className = 'col-md-8 py-3 m-auto'
    let card = `
            <div class="card">
                <div class="row">
                    <div class="col-md-2">
                        <img src="${img}" alt="${title.rendered}" width="100%"  height="auto"/>
                    </div>
                    <div class="col-md-10 py-3">
                        <h1 class="h3">${title.rendered}</h1>
                        <p class="text-justify">
                            ${excerpt.rendered}
                        </p>
                    </div>
                </div>
            </div>
        `

    div.innerHTML = card
    blogList.appendChild(div)
  })
}

async function getImage(id) {
  var res = await fetch(`${api_uri}/media/${id}`)
  var data = await res.json()
  return data.media_details.sizes.thumbnail.source_url
}

searchBtn.addEventListener('click', function (e) {
  searchBlogs(searchInput.value)
})

async function searchBlogs(searchValue) {
  blogList.innerHTML = ''
  try {
    var res = await fetch(`${api_uri}?search=${searchValue}`)
    var data = await res.json()
    renderBlogs(data)
  } catch (error) {
    console.error('Failed to search blogs:', error)
  }
}
