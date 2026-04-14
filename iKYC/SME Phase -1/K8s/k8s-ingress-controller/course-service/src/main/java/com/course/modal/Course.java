package com.course.modal;

public class Course {

	private int courserId;
	private String courseName;

	public int getCourserId() {
		return courserId;
	}

	public void setCourserId(int courserId) {
		this.courserId = courserId;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public Course() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Course(int courserId, String courseName) {
		super();
		this.courserId = courserId;
		this.courseName = courseName;
	}

}
