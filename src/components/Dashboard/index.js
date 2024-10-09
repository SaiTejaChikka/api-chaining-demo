import React, {useState} from 'react'
import axios from 'axios'

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [post, setPost] = useState({title: '', body: ''})
  const [createdPost, setCreatedPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch users from API
  const getUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users',
      )
      setUsers(response.data)
    } catch (err) {
      setError('Error fetching users')
    } finally {
      setLoading(false)
    }
  }

  // Create post
  const createPost = async () => {
    if (!selectedUserId || !post.title || !post.body) {
      setError('Please complete all fields')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        {
          title: post.title,
          body: post.body,
          userId: selectedUserId,
        },
      )
      setCreatedPost(response.data)
      console.log(response.data)
    } catch (err) {
      setError('Error creating post')
    } finally {
      setLoading(false)
    }
  }

  // Fetch comments based on post ID
  const getComments = async () => {
    if (!createdPost) return
    setLoading(true)
    setError('')
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/comments?postId=${createdPost}`,
      )
      setComments(response.data)
      console.log(response.data)
    } catch (err) {
      setError('Error fetching comments')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">API Chaining Demo</h1>

      {/* Fetch Users */}
      <div>
        <button
          onClick={getUsers}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Get Users
        </button>
        {users.length > 0 && (
          <select
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
            className="border px-4 py-2 mb-4"
          >
            <option value="">Select a User</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Create Post */}
      <div>
        <input
          type="text"
          placeholder="Post Title"
          value={post.title}
          onChange={e => setPost({...post, title: e.target.value})}
          className="border px-4 py-2 mb-2 w-full"
        />
        <textarea
          placeholder="Post Body"
          value={post.body}
          onChange={e => setPost({...post, body: e.target.value})}
          className="border px-4 py-2 mb-2 w-full"
        />
        <button
          onClick={createPost}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Create Post
        </button>
      </div>

      {/* Display Created Post */}
      {createdPost && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Created Post</h2>
          <p>
            <strong>Title:</strong> {createdPost.title}
          </p>
          <p>
            <strong>Body:</strong> {createdPost.body}
          </p>
          <p>
            <strong>userId</strong> {createdPost.userId}
          </p>
          <button
            onClick={getComments}
            className="bg-purple-500 text-white px-4 py-2 rounded mt-2"
          >
            Get Comments for this Post
          </button>
        </div>
      )}

      {/* Display Comments */}
      {comments.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Comments</h2>
          <ul className="list-disc list-inside">
            {comments.map(comment => (
              <li key={comment.id}>
                <p>
                  <strong>{comment.name}</strong>: {comment.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Loading and Error States */}
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}

export default Dashboard
