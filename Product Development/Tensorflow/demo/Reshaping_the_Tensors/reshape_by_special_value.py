import tensorflow as tf

# Original Tensors
original_tensor = tf.constant([[1,2,3],[4,5,6]])

# Reshaping the Tensors by using special value -1
# It will directly convert the 2D-tensor into 1D-tensor
reshaped_tensor = tf.reshape(original_tensor,[-1])

print("--------------------------------")
print("Original Tensor: ",original_tensor)
print("Shape: ", original_tensor.shape)
print("----------------------------------")
print("Reshaped Tensor: ",reshaped_tensor)
print("Shape: ",reshaped_tensor.shape)
print("-----------------------------------")