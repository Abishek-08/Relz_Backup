import tensorflow as tf

# Variable is data-structure, it is backed by tensors

print("-----------------------------------------")

# Declare an Tensor
x_tensor = tf.constant([1,2,3,4])
print("Tensor: ",x_tensor)

# Declare an variable with tensor
x_variable = tf.Variable(x_tensor)
print("x_variable: ",x_variable)
print("Shape: ",x_variable.shape)
print("Data-Type: ",x_variable.dtype)
print("to_numpy: ",x_variable.numpy())
print("-----------------------------------------")

# Declare an variable with boolean
bool_variable = tf.Variable([True,False])
print("bool_variable: ",bool_variable)
print("Shape: ",bool_variable.shape)
print("Data-Type: ",bool_variable.dtype)
print("to_numpy: ",bool_variable.numpy())
print("-----------------------------------------")

complex_variable = tf.Variable([1+2j,3+4j])
print("Complex-variable: ",complex_variable)
print("Shape: ",complex_variable.shape)
print("Data-Type: ",complex_variable.dtype)
print("to_numpy: ",complex_variable.numpy())
print("----------------------------------------")