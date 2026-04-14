package com.rts.cap.dao;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Login;
import com.rts.cap.model.UserRequests;

/**
 * @author sathiyan.sivarajan
 * @since 01-07-2024
 * @version 1.0
 */

public interface LoginDao {
	
	
	public UserRequests saveRequest(UserRequests requests);
	
	public void save(Login login);
	
	public Login findByEmail(String email) throws CapBusinessException;
	
	public void deleteUserDetails(String email)throws CapBusinessException ;
	
}
