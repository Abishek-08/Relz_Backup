import tensorflow as tf

tensor_rank_3 = tf.constant([
    [[1,2,3],[4,5,6]],
    [[7,8,9],[10,11,12]],
    [[13,14,15],[16,17,18]]
    ])

print("-----------------------------------------------")
print("Original Tensors: ",tensor_rank_3)
print("Shape of the Tensor: ",tensor_rank_3.shape)

# Performing the Indexing and Slicing operations in 3D-tensor
# Perform Slicing operation in certain range
# x[:,:,:] -> it means it will get the all no.of stacks, all no.of rows and all no.of columns
print("------------------------------------------------")
print("range b/w [:,:,:]: ",tensor_rank_3[:,:,:].numpy())
print("\nrange b/w [0,1,2]: ",tensor_rank_3[0,1,2].numpy())
print("\nrange b/w [:,1:,1:]: ",tensor_rank_3[:,1:,1:].numpy())

