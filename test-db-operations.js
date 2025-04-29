const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testOperations() {
  try {
    console.log('Testing database operations...');

    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'test123',
        name: 'Test User',
        role: 'user'
      }
    });
    console.log('Created user:', user);

    // Create a test blog post
    const blog = await prisma.blog.create({
      data: {
        title: 'Test Blog Post',
        slug: 'test-blog-post',
        content: 'This is a test blog post content.',
        excerpt: 'A test blog post excerpt.',
        published: true,
        authorId: user.id
      }
    });
    console.log('Created blog post:', blog);

    // Query the created blog post with author
    const blogWithAuthor = await prisma.blog.findUnique({
      where: { id: blog.id },
      include: { author: true }
    });
    console.log('Blog post with author:', blogWithAuthor);

  } catch (error) {
    console.error('Error performing database operations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOperations(); 