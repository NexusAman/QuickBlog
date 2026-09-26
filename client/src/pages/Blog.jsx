import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router'
import {assets, blog_data} from '../assets/assets'
import Navbar from '../components/Navbar'
import Moment from 'moment'

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

      <div>
        <p>Published on {Moment(data.createdAt).format('MMMM Do YYYY')}</p>
        <h1>{data.title}</h1>
        <h2>{data.subTitle}</h2>
        <p>Michael Brown</p>
      </div>

      <div>
        <img src={data.image} alt="" />
        {/* blog description: */}
        <div dangerouslySetInnerHTML={{__html: data.description}}></div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

export default Blog