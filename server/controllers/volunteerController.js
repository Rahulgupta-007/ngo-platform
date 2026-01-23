const VolunteerPost = require('../models/VolunteerPost');
const Application = require('../models/Application');
// 1. Create a Post (For NGOs)
exports.createPost = async (req, res) => {
  try {
    const { title, description, skills, location } = req.body;
    const newPost = await VolunteerPost.create({
      title, description, 
      skillsRequired: skills, // Ensure frontend sends array or parse it here
      location,
      ngoId: req.user.id,
      ngoName: req.user.name
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Get All Posts (For Volunteers)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await VolunteerPost.findAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Fetch Failed" });
  }
};

// 3. Get My Posts (For NGO Dashboard)
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await VolunteerPost.findAll({ where: { ngoId: req.user.id } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Fetch Failed" });
  }
};
exports.applyForPost = async (req, res) => {
  try {
    const { postId } = req.body;
    
    // Check if post exists
    const post = await VolunteerPost.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if already applied
    const existing = await Application.findOne({ 
      where: { volunteerId: req.user.id, postId } 
    });
    if (existing) return res.status(400).json({ message: "You have already applied!" });

    // Create Application
    await Application.create({
      volunteerId: req.user.id,
      volunteerName: req.user.name,
      postId,
      postTitle: post.title
    });

    // Increment applicant count on the post
    post.applicants = (post.applicants || 0) + 1;
    await post.save();

    res.json({ message: "Application Sent Successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Application Failed" });
  }
};

// 5. Get Applications for MY Posts (NGO Only)
exports.getMyApplications = async (req, res) => {
  try {
    // Find posts created by this NGO
    const myPosts = await VolunteerPost.findAll({ where: { ngoId: req.user.id } });
    const postIds = myPosts.map(p => p.id);

    // Find applications for those posts
    const applications = await Application.findAll({
      where: { postId: postIds },
      order: [['appliedAt', 'DESC']]
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Fetch Failed" });
  }
};
// 6. Get Applications for a SPECIFIC Post
exports.getPostApplications = async (req, res) => {
  try {
    const { id } = req.params; // Post ID

    // Security Check: Ensure this post belongs to the logged-in NGO
    const post = await VolunteerPost.findOne({ where: { id, ngoId: req.user.id } });
    if (!post) return res.status(403).json({ message: "Access Denied or Post not found" });

    // Fetch Applications
    const applications = await Application.findAll({
      where: { postId: id },
      order: [['appliedAt', 'DESC']]
    });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};