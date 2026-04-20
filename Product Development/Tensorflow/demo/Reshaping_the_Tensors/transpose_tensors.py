import tensorflow as tf

# Original Tensor
original_tensor = tf.constant([[1,2,3],[4,5,6]])

# Reshaping the Tensor 
reshaped_tensor = tf.reshape(original_tensor,[6])

# Transpose using permuted dimensions
# changing the rows to columns and columns to rows, here perm it has args like [n,0] n-> rank of the input tensors
transposed_tensor = tf.transpose(original_tensor,perm=[1,0])

print("---------------------------------")
print("Original Tensor: ",original_tensor)
print("Shape: ",original_tensor.shape)
print("---------------------------------")
print("Reshaped Tensor: ",reshaped_tensor)
print("Shape: ",reshaped_tensor.shape)
print("---------------------------------")
print("Transpoed Tensor: ",transposed_tensor)
print("Shape: ",transposed_tensor.shape)
print("Converting the (2,3) dimension tensor into (3,2)")