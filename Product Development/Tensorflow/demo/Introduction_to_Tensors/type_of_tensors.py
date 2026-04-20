import tensorflow as tf

# Types of Tensors

# Scalar (O-D) - 'Zero-Dimensional'
scalar_tf = tf.constant(4)

# Vector (1-D) - 'One-Dimensional' 
vector_tf = tf.constant([1,2,3])

# Matrix (2-D) - 'Two-Dimensional' 
matrix_tf = tf.constant([[1,2,3],[4,5,6]])

# Tenosr (3-D) - 'Three-Dimensional'
tensor_3d_tf =  tf.constant([[[1,2,3],[4,5,6]],[[7,8,9],[10,11,12]],[[13,14,15],[16,17,18]]])


# Print Statement
print("Scalar-Tensor: ",scalar_tf)
print("Vector-Tensor: ",vector_tf)
print("Matrix-Tensor: ",matrix_tf)
print("3D-Tensor: ",tensor_3d_tf)

