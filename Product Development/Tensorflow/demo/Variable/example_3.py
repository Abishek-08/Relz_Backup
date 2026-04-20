import tensorflow as tf

# As noted above, variables are backed by tensors. 
# You can reassign the tensor using tf.Variable.assign. 
# Calling assign does not (usually) allocate a new tensor; instead, the existing tensor's memory is reused.

original_variable = tf.Variable([1,2,3,4])
print("--------------------------------------")
print("Original-Variable: ", original_variable)

# If you use a variable like a tensor in operations, you will usually operate on the backing tensor.
# Creating new variables from existing variables duplicates the backing tensors. Two variables will not share the same memory.

a = tf.Variable([1,2])
# create variable 'b' based on 'a'
b = tf.Variable(a)
a.assign([3,4])

print("--------------------------------------")
# 'a' and 'b' are different
print("a-variable: ", a.numpy())
print("b-variable: ",b.numpy())
print("--------------------------------------")
# There are another version of assign
add_assign = a.assign_add([10,20])
print("add-assign: ", add_assign.numpy())

sub_assign = b.assign_sub([10,20])
print("sub-assign: ", sub_assign.numpy())