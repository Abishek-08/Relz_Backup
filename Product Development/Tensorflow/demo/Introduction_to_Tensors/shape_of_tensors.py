import tensorflow as tf

# what is meant by Tensor-Shape:
# Tensor shape refers to the layout or structure of a tensor, 
# which defines the number of dimensions and the size of each dimension in the tensor. 
# It describes how many elements are along each axis of the tensor.

# Scalar (O-D) - 'Zero-Dimensional'
scalar_tf = tf.constant(4)

# Vector (1-D) - 'One-Dimensional' 
vector_tf = tf.constant([1,2,3])

# Matrix (2-D) - 'Two-Dimensional' 
matrix_tf = tf.constant([[1,2,3],[4,5,6]])

# Tensor (3-D) - 'Three-Dimensional'
tensor_3d_tf =  tf.constant([[[1,2,3],[4,5,6]],[[7,8,9],[10,11,12]],[[13,14,15],[16,17,18]]])

list_of_tensor = {'scalar_tf':scalar_tf,'vector_tf':vector_tf,'matrix_tf':matrix_tf,'tensor_3d_tf':tensor_3d_tf}

for name in list_of_tensor:
    print(f'Shape of the tensor {name} :',list_of_tensor[name].shape)
