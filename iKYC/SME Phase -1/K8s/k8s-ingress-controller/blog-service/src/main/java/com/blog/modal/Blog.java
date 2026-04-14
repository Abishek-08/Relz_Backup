package com.blog.modal;

public class Blog {

	private int blogId;
	private String blogDate;

	public Blog() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Blog(int blogId, String blogDate) {
		super();
		this.blogId = blogId;
		this.blogDate = blogDate;
	}

	public int getBlogId() {
		return blogId;
	}

	public void setBlogId(int blogId) {
		this.blogId = blogId;
	}

	public String getBlogDate() {
		return blogDate;
	}

	public void setBlogDate(String blogDate) {
		this.blogDate = blogDate;
	}

}
