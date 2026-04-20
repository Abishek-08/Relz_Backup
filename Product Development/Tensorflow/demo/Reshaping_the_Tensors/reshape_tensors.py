import tensorflow as tf

# Tensor reshaping is the process of reshaping the order and total number of elements in tensors while only the shape is being changed. 
# It is a fundamental operation in TensorFlow that allows you to change the shape of a tensor without changing its underlying data.

# Hints: 'while reshaping the tensor from one form to another, please the total no of elements before reshape is same as well as after reshaping'
# For eg: while reshape [2,3] 2D-tensor into 1D-tensor the shape will be [6] not other than [6]. (not [5],[4] because some elements can't be eliminated while reshaping)


# Reshaping will "work" for any new shape with the same total number of elements, but it will not do anything useful if you do not respect the order of the axes.
# Swapping axes in tf.reshape does not work; you need tf.transpose for that.



original_tensor_2D = tf.constant([[1,2,3],[4,5,6]])

print('Original Shape:')
print(f'Shape of the tensor_two_D is: ',tf.shape(original_tensor_2D).numpy())

# Reshaping the 2D-tensor into the 1D-tensor
reshaped_tensor_1D = tf.reshape(original_tensor_2D,[6])
print("Reshaped Tensor is: ",reshaped_tensor_1D)

# Reshaping the 2D-tensor into the 2D-tensor with different shape
reshaped_tensor_2D = tf.reshape(original_tensor_2D,[1,6])
print("Reshaped 2D-tensor is: ",reshaped_tensor_2D)

reshaped_tensor_3D = tf.reshape(original_tensor_2D,[1,2,3])
print("Reshaped 3D-tensor is: ", reshaped_tensor_3D)


