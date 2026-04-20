import tensorflow as tf

tensor_rank_2 = tf.constant([[1,2,3],
                             [4,5,6],
                             [7,8,9]])

print("-------------------------------")
print("Original Tensor: ")
print(tensor_rank_2)
print("Shape of Tensor: ",tensor_rank_2.shape)

# Indexing and Slicing operation in the 2D-tensor
# x[row_start:row_end+1, cols_start:cols_end+1]

print("--------------------------------")
print("range b/w [0:2,0:2]: ",tensor_rank_2[0:2,0:2].numpy())
print("range b/w [:2,:2]: ",tensor_rank_2[:2,:2].numpy())

# Indexing in the backward direction
# x[-1,:] -> means -1 for last row and ':' want all column values for that row. (same as well for column for also)
print("--------------------------------")
print("****Backward Direction*****")
print("range b/w [-1,:]: ",tensor_rank_2[-1,:].numpy())
print("range b/w [-2,-1]: ",tensor_rank_2[-2,-1].numpy())
print("range b/w [-2:,:]: ",tensor_rank_2[-2:,:].numpy())
print("range b/w [-2:,-2:]: ",tensor_rank_2[-2:,-2:].numpy())
