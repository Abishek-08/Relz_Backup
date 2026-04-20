import tensorflow as tf

# what is meant by tensor-size:
# -----------------------------
# Tensor size refers to the total number of elements in a tensor. 
# It is the product of all the dimensions (sizes) of the tensor. 
# In other words, it represents the total amount of data stored in the tensor.

# Scalar (O-D) - 'Zero-Dimensional'
scalar_tf = tf.constant(4)

# Vector (1-D) - 'One-Dimensional' 
vector_tf = tf.constant([1,2,3])

# Matrix (2-D) - 'Two-Dimensional' 
matrix_tf = tf.constant([[1,2,3],[4,5,6]])

# Tenosr (3-D) - 'Three-Dimensional'
tensor_3d_tf =  tf.constant([[[1,2,3],[4,5,6]],[[7,8,9],[10,11,12]],[[13,14,15],[16,17,18]]])


list_of_tensor = {'scalar_tf':scalar_tf,'vector_tf':vector_tf,'matrix_tf':matrix_tf,'tensor_3d_tf':tensor_3d_tf}


# using tf.size() - method to determine the size of the tensors
for name in list_of_tensor:
    print(f'Shape of the {name}: ',list_of_tensor[name].shape)
    print(f'Size of the {name} is: ',tf.size(list_of_tensor[name]))