import tensorflow as tf

ragged_tensor = tf.ragged.constant([
    [1,2,3,4],
    [1,2],
    [1,2,3],
    [4]
])

print("Ragged Tensor: ")
print(ragged_tensor)

# The shape of a tf.RaggedTensor will contain some axes with unknown lengths:
print("\n Shape of the ragged tensor: ",ragged_tensor.shape)


# Hints: 
# Can't convert non-rectangular Python sequence to Tensor.