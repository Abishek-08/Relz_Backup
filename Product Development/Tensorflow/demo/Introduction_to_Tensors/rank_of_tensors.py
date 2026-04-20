import tensorflow as tf

# Tensor rank, also known as the tensor's number of dimensions, is a fundamental concept in TensorFlow. 
# It indicates the number of dimensions present in a tensor.

# Here's a brief overview of tensor rank:

#     Rank 0: Scalars. Tensors of rank 0 represent single values.
#     Rank 1: Vectors. Tensors of rank 1 have one dimension and represent arrays of values.
#     Rank 2: Matrices. Tensors of rank 2 have two dimensions and represent 2D arrays of values.
#     Rank 3 and above: Tensors of rank 3 or higher have three or more dimensions and represent higher-dimensional arrays of values.



# Scalar (O-D) - 'Zero-Dimensional'
scalar_tf = tf.constant(4)

# Vector (1-D) - 'One-Dimensional' 
vector_tf = tf.constant([1,2,3])

# Matrix (2-D) - 'Two-Dimensional' 
matrix_tf = tf.constant([[1,2,3],[4,5,6]])

# Tenosr (3-D) - 'Three-Dimensional'
tensor_3d_tf =  tf.constant([[[1,2,3],[4,5,6]],[[7,8,9],[10,11,12]],[[13,14,15],[16,17,18]]])

list_of_tensor = dict(scalar_tf=scalar_tf, vector_tf=vector_tf, matrix_tf=matrix_tf, tensor_3d_tf=tensor_3d_tf)

for name in list_of_tensor:
    rank = tf.rank(list_of_tensor[name])
    print(f'Rank of the {name} is: ',rank.numpy())
