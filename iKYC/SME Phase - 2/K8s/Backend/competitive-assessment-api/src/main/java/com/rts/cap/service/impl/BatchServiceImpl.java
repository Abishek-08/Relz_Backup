package com.rts.cap.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rts.cap.dao.BatchDao;
import com.rts.cap.dao.UserDao;
import com.rts.cap.model.Batch;
import com.rts.cap.model.User;
import com.rts.cap.service.BatchService;
import com.rts.cap.service.MailService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class BatchServiceImpl implements BatchService {

	private final BatchDao batchDao;

	private final UserDao userDao;

	private final MailService mailService;

	private static final Logger LOGGER = LogManager.getLogger(BatchServiceImpl.class);

	/**
	 * Adds a new batch to the database.
	 * 
	 * @param batch the batch to be added
	 */
	@Override
	public void addBatch(Batch batch) {
		batchDao.saveBatch(batch);
	}

	/**
	 * Retrieves and returns a list of all batches.
	 * 
	 * @return a list of all batches
	 */
	@Override
	public List<Batch> viewAllBatch() {
		return batchDao.viewAllBatch();
	}

	/**
	 * Updates an existing batch with new information.
	 * 
	 * @param batch the batch object containing updated information
	 */
	@Override
	public void updateBatch(Batch batch) {

		if (!Objects.isNull(batch)) {
			Batch batchTemp = batchDao.findBatchById(batch.getBatchId());
			batchTemp.setBatchName(batch.getBatchName());
			batchTemp.setBatchSize(batch.getBatchSize());
			batchTemp.setBatchDescription(batch.getBatchDescription());
			batchTemp.setBatchUpdationDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));

			batchDao.saveBatch(batchTemp);
		} else {
			LOGGER.error("batch is empty while updating the batch");
		}

	}

	/**
	 * Deletes a batch if it has no associated users.
	 * 
	 * @param id the ID of the batch to be deleted
	 * @return true if the batch was deleted, false otherwise
	 */
	@Override
	public boolean deleteBatch(int id) {
		Batch batch = batchDao.findBatchById(id);

		if (batch.getUser().isEmpty()) {
			return batchDao.deleteBatch(batch);
		} else {
			return false;
		}
	}

	/**
	 * Checks if a batch name already exists.
	 * 
	 * @param batchName the name of the batch to check
	 * @return true if the name exists, false otherwise
	 */
	@Override
	public boolean findName(String batchName) {
		return batchDao.findName(batchName);
	}

	/**
	 * Adds users to a batch if it doesn't exceed the batch size.
	 * 
	 * @param userId  the list of user IDs to be added
	 * @param batchId the ID of the batch to which users are added
	 * @return true if users were added successfully, false otherwise
	 */
	@Override
	public boolean addUserToBatch(List<Integer> userId, int batchId) {
		List<Integer> userIdList = userId;
		// Fetch the batch from database
		Batch batch = batchDao.findBatchById(batchId);

		// Validate length conditions
		int batchUserListSize = batch.getUser().size();
		int newBatchObject = userIdList.size();
		int batchCount = batch.getBatchSize();
		int temporaryTotal = batchUserListSize + newBatchObject;

		if (temporaryTotal > batchCount) {
			return false;
		}
		userIdList.stream().forEach(userid -> {
			User user = userDao.findUserById(userid);
			batch.getUser().add(user);
		});
		batch.setPresentCount(temporaryTotal);
		batchDao.saveBatch(batch);

		// Send emails after database update
		for (int id : userIdList) {
			User tempUser = userDao.findUserById(id);
			mailService.sendUserAddedEmail(tempUser.getUserEmail(), batch.getBatchName(), tempUser.getUserName());
		}

		return true;
	}

	/**
	 * Finds and returns a batch by its ID.
	 * 
	 * @param batchId the ID of the batch to find
	 * @return the batch with the specified ID
	 */
	@Override
	public Batch findBatchById(int batchId) {

		return batchDao.findBatchById(batchId);
	}

	/**
	 * Removes a user from a batch and sends a notification email.
	 * 
	 * @param batchId the ID of the batch from which to remove the user
	 * @param userId  the ID of the user to be removed
	 * @return true if the user was removed successfully
	 */
	@Override
	public boolean deleteUserFromBatch(int batchId, int userId) {
		Batch batch = batchDao.findBatchById(batchId);

		// Using Java Stream to filter and remove the user
		batch.setUser(batch.getUser().stream().filter(user -> userId != user.getUserId()).toList());

		batchDao.saveBatch(batch);

		// Sending email
		batch.getUser().stream().filter(user -> userId == user.getUserId()).findFirst().ifPresent(user -> mailService
				.sendUserBatchRemovalMail(user.getUserEmail(), batch.getBatchName(), user.getUserName()));

		return true;
	}

	/**
	 * Removes a list of users from a batch and sends notification emails.
	 * 
	 * @param batchId the ID of the batch from which to remove users
	 * @param list    the list of user IDs to be removed
	 * @return true if users were removed successfully
	 */
	@Override
	public boolean deleteUserFromBatch(int batchId, List<Integer> list) {
		Batch batch = batchDao.findBatchById(batchId);
		List<User> userList = batch.getUser();
		int size = list.size();
		int presentCount = batch.getUser().size();

		list.forEach(userId -> userList.removeIf(user -> {
			if (userId.equals(user.getUserId())) {
				mailService.sendUserBatchRemovalMail(user.getUserEmail(), batch.getBatchName(), user.getUserName());
				return true;
			}
			return false;
		}));
		batch.setPresentCount(presentCount - size);
		batchDao.saveBatch(batch);
		return true; // Consider changing this based on success/failure criteria
	}

}
