package com.rts.cap.dao.impl;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.UserDao;
import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.SkillAttempt;
import com.rts.cap.model.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;

/**
 * @author abishek.kumar
 * @since 28-06-2024
 * @version 1.0
 */

@Repository
public class UserDaoImpl implements UserDao {

	private EntityManager entityManager;

	/**
	 * This is an Dependency injection for the EntityManager using constructor
	 * 
	 * @param entityManager
	 */
	public UserDaoImpl(EntityManager entityManager) {
		super();
		this.entityManager = entityManager;
	}

	/**
	 * This "saveUser" method is used to save the user object into the database.
	 * 
	 * @param user
	 */
	@Override
	public User addUser(User user) {
		entityManager.persist(user);
		entityManager.flush();
		return user;
	}

	/**
	 * This "findUserById" method is used to find the user object by using userId.
	 * 
	 * @param userId
	 */
	@Override
	public User findUserById(long userId) {
		return entityManager.find(User.class, userId);

	}

	/**
	 * This "findUserByUserName" method is used to find the user object by using
	 * userName.
	 * 
	 * @param userName
	 */
	@Override
	public boolean validateUserByUserEmail(String userEmail) {
		try {
			entityManager.createQuery("from User where userEmail=:email").setParameter("email", userEmail)
					.getSingleResult();
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * This "deleteUserById" used to delete the user by userId.
	 * 
	 * @param userId
	 */
	@Override
	public boolean deleteUserById(int userId) {
		try {
			User user = entityManager.find(User.class, userId);
			entityManager.remove(user);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * @author sherin.david
	 * @since 28-06-2024
	 * @version 1.0 Update This "updateUser" is used to update the user by userId
	 */
	@Override
	public ResponseEntity<Object> updateUser(User user) {
		return ResponseEntity.ok(MessageConstants.USER_UPDATED_SUCCESS);
	}

	/**
	 * @author sherin.david
	 * @since 29-06-2024
	 * @version 1.0 This "updateProfile" is used to update the user profile by
	 *          userId
	 */
	@Override
	public String updateProfile(User user) {
		try {

			entityManager.persist(user);
			return "success";

		} catch (Exception e) {
			return "failure";
		}
	}

	/**
	 * This "findAllByUser" is used to list of all users.
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<User> findAllByUser() {
//		String query = "SELECT u FROM User u WHERE u.role = 'USER'";
		String query = "SELECT u FROM User u WHERE u.userEmail IN "
				+ "(SELECT l.email FROM Login l WHERE l.role = 'USER')";
		return entityManager.createQuery(query).getResultList();
	}

	/**
	 * This "findUserByEmail" is user to get the User Object by EmailId
	 * 
	 * @author sathiyan.sivarajan
	 * @since 01-07-2024
	 * @version 1.0
	 * @param email
	 */
	@Override
	public User findUserByEmail(String email) {
		TypedQuery<User> query = entityManager
				.createQuery("SELECT user FROM User user WHERE user.userEmail = :userEmail", User.class);
		query.setParameter("userEmail", email);
		return query.getSingleResult();
	}

	/**
	 * @author sowmiya.ramu
	 * @since 26-07-2024
	 * @version 5.0 This "updateStatus" is used to update the user status active or
	 *          inactive by using userId
	 */

	@Transactional
	@Override
	public boolean updateStatus(int userId, String status) {
		Query query = entityManager.createQuery("UPDATE User SET userStatus = :status WHERE userId = :userId");
		query.setParameter("status", status);
		query.setParameter("userId", userId);
		query.executeUpdate();
		return true;
	}

	/**
	 * This "findSkillAttemptsByUserId" is used to list the unmapped user skill
	 * assessment report.
	 */

	@Override
	public List<SkillAttempt> findSkillAttemptsByUserId(int userId) {
		TypedQuery<SkillAttempt> query = entityManager
				.createQuery("SELECT user FROM SkillAttempt user WHERE user.user.id = :userId", SkillAttempt.class);
		query.setParameter("userId", userId);
		return query.getResultList();
	}

	/**
	 * This "findAssessmentScoreCardsByUserId" is used to list the unmapped user
	 * learning assessment report.
	 */

	@Override
	public List<LearningAssessmentScoreCard> findLearningScoreCardsByUserId(int userId) {
		TypedQuery<LearningAssessmentScoreCard> query = entityManager.createQuery(
				"SELECT l FROM LearningAssessmentScoreCard l WHERE l.user.id = :userId",
				LearningAssessmentScoreCard.class);
		query.setParameter("userId", userId);
		return query.getResultList();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> findUnBatchedUsers() {
		return entityManager.createNativeQuery(
				"SELECT user_id,user_name,user_first_name,user_last_name,user_email,user_password,userdob,user_mobile,user_status,user_gender,us.fresh_user,user_image_data,user_creation_date,user_updation_date\r\n"
				+ "FROM user_tbl us\r\n"
				+ "JOIN login_tbl lg ON lg.role = \"USER\" AND us.user_email = lg.email\r\n"
				+ "WHERE us.user_id NOT IN (SELECT user_user_id FROM batch_user)")
				.getResultList();
	}

}
