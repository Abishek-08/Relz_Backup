package com.rts.cap.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.dao.UserRequestDao;
import com.rts.cap.model.UserRequests;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

/**
 * @author sundharraj.soundhar
 * @since 07-08-2024
 * @version 6.0
 * 
 */

@Repository
@RequiredArgsConstructor
public class UserRequestDaoImpl implements UserRequestDao {

	private final EntityManager entityManager;

//	@Override
//	public UserRequests saveRequest(UserRequests requests) {
//		entityManager.persist(requests);
//		return requests;
//	}

	@Override
	public List<UserRequests> getAllRequests() {
		return entityManager.createQuery("SELECT request FROM UserRequests request", UserRequests.class)
				.getResultList();
	}

	@Override
	public List<UserRequests> findUserRequest(String email) {
		return entityManager
				.createQuery("SELECT request FROM UserRequests request where request.user.userEmail = :email",
						UserRequests.class)
				.setParameter("email", email).getResultList();
	}

	@Override
	public boolean deleteRequestByUserId(int userId) {
		try {
			UserRequests userRequest = entityManager
					.createQuery("SELECT request FROM UserRequests request where request.user.userId = :id",
							UserRequests.class)
					.setParameter("id", userId).getSingleResult();
			entityManager.remove(userRequest);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	@Override
	public void updateRequestStatus(long requestId, String status) {
		entityManager.createQuery("update UserRequests set requestStatus=:status where userRequestId=:requestId")
				.setParameter("status", status).setParameter("requestId", requestId).executeUpdate();

	}

}
