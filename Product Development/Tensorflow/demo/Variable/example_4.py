import tensorflow as tf

tensor = tf.constant([1,2,3,4])

# Create a and b; they will have the same name but will be backed by
# different tensors.
a = tf.Variable(tensor, name="Mark")

# A new variable with the same name, but different value
# Note that the scalar add is broadcast
b = tf.Variable(tensor+1, name="Mark")

c = tf.Variable(tensor, name="Mark")

# These are elementwise-unequal, despite having the same name
print("---------------------------------------------------")
print("Element-wise-Equal: ", a == c)
print("---------------------------------------------------")

# This is equal because, elementwise-equal
print("Element-wise-unequal:", a == b)
