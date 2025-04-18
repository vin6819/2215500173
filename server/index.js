const express = require('express');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
axiosRetry(axios, {
  retries: 3,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 503;
  },
});
require('dotenv').config();
const port = 8000;
const app = express();

app.get('/users', async (req, res) => {
  const resp = await axios.post('http://20.244.56.144/evaluation-service/auth',
    {
        "email": "vinay.kumar_cs.aiml22@gla.ac.in",
        "name": "vinay kumar",
        "rollNo": "2215500173",
        "accessCode": "CNneGT",
        "clientID": "c7638e4e-b93a-47d3-a1f8-7a6cf30540aa",
        "clientSecret": "nZmWXqqgZxgztRqx"
    }
  )
  const TOKEN = resp.data.access_token;
  // const TOKEN = process.env.TOKEN;
  const response = await axios.get("http://20.244.56.144/evaluation-service/users",
    { headers: {'Authorization': `Bearer ${TOKEN}`} } 
  );
  const users = response.data.users;
  // console.log(users)
  const posts = {}
  try {
    for (const key in users) {
      const response = await axios.get(`http://20.244.56.144/evaluation-service/users/${key}/posts`,
        { headers: {'Authorization': `Bearer ${TOKEN}`} }
      )
      posts[key] = response.data.posts
    }
  } catch (error) {
    // console.log(comments)
  }
  const comments = {}
  try {
    async function func() {
      for (const key in posts) {
        let c = 0;
        const postPromises = posts[key].map(async (e) => {
          try {
            const response = await axios.get(
              `http://20.244.56.144/evaluation-service/posts/${e.id}/comments`,
              { headers: { 'Authorization': `Bearer ${TOKEN}` } }
            );
            c += response.data.comments.length;
          } catch (error) {
            // console.error(`Error fetching comments for post ${e.id}:`, error);
          }
        });
  
        // Wait for all comment-fetching promises to resolve
        await Promise.all(postPromises);
        comments[key] = c;
      }
    }
    await func();
  } catch (error) {
    console.error("Error processing comments:", error);
  }
  
  const sortedComments = Object.entries(comments).sort(([, a], [, b]) => Number(b) - Number(a));
  const topComments = sortedComments.slice(0, 5);
  const topUsers = [];
  for (const i in topComments) {
    topUsers.push(users[topComments[i][0]])
  }
  res.send({ topUsers });
});

app.get("/posts", async (req, res) => {
  try {
    const query = req.query.type;
    if (query !== "popular" && query !== "latest") {
      return res.status(400).send("Invalid query parameter. Use 'popular' or 'latest'.");
    }
    const resp = await axios.post('http://20.244.56.144/evaluation-service/auth',
      {
          "email": "vinay.kumar_cs.aiml22@gla.ac.in",
          "name": "vinay kumar",
          "rollNo": "2215500173",
          "accessCode": "CNneGT",
          "clientID": "c7638e4e-b93a-47d3-a1f8-7a6cf30540aa",
          "clientSecret": "nZmWXqqgZxgztRqx"
      }
    )
    const TOKEN = resp.data.access_token;
    // const TOKEN = process.env.TOKEN;
    const response = await axios.get("http://20.244.56.144/evaluation-service/users",
      { headers: {'Authorization': `Bearer ${TOKEN}`} } 
    );
    const users = response.data.users;
    // console.log(users)
    let posts = []
    try {
      for (const key in users) {
        const response = await axios.get(`http://20.244.56.144/evaluation-service/users/${key}/posts`,
          { headers: {'Authorization': `Bearer ${TOKEN}`} }
        )
        response.data.posts.forEach(post => {
           posts.push(post)
        });
      }
    } catch (error) {
      // console.log(comments)
    }
    let pc = []
    if (query === "popular") {
      for (const e of posts) {
        try {
          const response = await axios.get(
            `http://20.244.56.144/evaluation-service/posts/${e.id}/comments`,
            { headers: { 'Authorization': `Bearer ${TOKEN}` } }
          );
          pc.push({post: post, comments: response.data.length});
        } catch (error) {
          
        }
      }
      pc = pc.slice(0, 5)
      res.send({ pc })
    }
    else {
      posts = posts.slice(0, 5);
      res.send({ posts })
    }
    res.send(query || "No query parameter provided");
  } catch (error) {
    console.error("Error handling /posts route:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});