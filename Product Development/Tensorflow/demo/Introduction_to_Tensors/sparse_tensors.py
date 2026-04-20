import tensorflow as tf

# sparse Tensor
# Sometimes, your data is sparse, like a very wide embedding space. 
# TensorFlow supports tf.sparse.SparseTensor and related operations to store sparse data efficiently.
# creating a sparse tensor, you need to specify the following three components:

#     Values: These are the non-zero values, represented in 1D tensor.
#     Indices: These are the indices of the non-zero values in the tensor, represented in 2D tensor.
#     Dense Shape: It specifies the overall shape of the tensor in 1D tensor.

values = tf.constant([11,22],dtype=tf.int32)
indices = tf.constant([
    [0,0],
    [1,2]
    ],dtype=tf.int64)
dense_shape = tf.constant([3,4],dtype=tf.int64)

sparse_Tensor = tf.sparse.SparseTensor(indices=indices,values=values,dense_shape=dense_shape)
print("sparse-tensor: ",sparse_Tensor)

# convert sparse tensor to dense:
converted_dense_tensor = tf.sparse.to_dense(sparse_Tensor)
print("dense-tensor: ",converted_dense_tensor)