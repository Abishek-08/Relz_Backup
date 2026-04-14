package com.rts.cap.dao.impl;

import org.springframework.stereotype.Repository;

import com.rts.cap.dao.LoginDao;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Login;
import com.rts.cap.model.UserRequests;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

/**
 * @author sathiyan.sivarajan
 * @since 01-07-2024
 * @version 1.0
 */

@Repository
public class LoginDaoImpl implements LoginDao {

	@PersistenceContext
	private EntityManager entityManager;

	/**
	 * @author sathiyan.sivarajan
	 * @since 01-07-2024
	 * @version 1.0
	 * @param Login Object
	 * @return void This method allows user to save their details in to the database
	 *         for future purpose
	 */
	@Override
	@Transactional
	public void save(Login login) {
		entityManager.persist(login);
	}

	/**
	 * @author sathiyan.sivarajan
	 * @since 01-07-2024
	 * @version 1.0
	 * @param id
	 * @return login Object This method is used to retrieve the login details from
	 *         Database with the help of Login Id
	 */
	public Login getLoginbyId(int id) {
		TypedQuery<Login> query = entityManager.createQuery("FROM Login log WHERE log.loginId = :loginId", Login.class);
		query.setParameter("loginId", id);
		return query.getSingleResult();
	}

	/**
	 * @author sathiyan.sivarajan
	 * @since 01-07-2024
	 * @version 1.0
	 * @param Email Id
	 * @return login Object This method is used to retrieve the login details from
	 *         Database with the help of User mail Id
	 * @throws CapBusinessException 
	 */
	@Override
	public Login findByEmail(String email) throws CapBusinessException {
		TypedQuery<Login> query = entityManager.createQuery("SELECT log FROM Login log WHERE log.email = :email",
				Login.class);
		query.setParameter("email", email);

		try {
			return query.getSingleResult();
		} catch (Exception e) {
			throw new CapBusinessException("No result Found");
		}
	}

	/**
	 * @author sathiyan.sivarajan
	 * @since 01-07-2024
	 * @version 1.0
	 * @param Email Id
	 * @return login Object This method is used to delete the user from the database
	 *         based on their Email id
	 * @throws CapBusinessException 
	 */
	@Override
	@Transactional
	public void deleteUserDetails(String email) throws CapBusinessException {
		Login user = findByEmail(email);
		if (user != null) {
			entityManager.remove(user);
		}
	}
	
	@Override
	public UserRequests saveRequest(UserRequests requests) {
		entityManager.persist(requests);
		return requests;
	}

}
