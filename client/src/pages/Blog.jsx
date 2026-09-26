import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router'
import {blog_data} from '../assets/assets'
import Navbar from '../components/Navbar'

const Blog = () => {
  const {id} = useParams()
  const [data, setData] = useState(null)

  const fetchBlogData = async () => {
    const found_data = blog_data.find(item => item._id === id)
    setData(found_data)
  }

  useEffect(() => {
    fetchBlogData()
  }, [])

  return data ? (
    <div>
      <Navbar />
      {/* <h1>Blog</h1> */}
    </div>
  ) : (
    <div>Loading...</div>
  )
}

export default Blog