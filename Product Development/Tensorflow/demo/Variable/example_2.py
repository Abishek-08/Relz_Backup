import tensorflow as tf
import numpy as np

print("----------------------------------")
variable = tf.Variable([1,2,3,4])
print("Original-Variable: ",np.array(variable))
print("-----------------------------------------")

# convert_to_tensor in variable
tensor_variable = tf.convert_to_tensor(variable)
print("viewed-as-tensor: ",tensor_variable)
print("-----------------------------------------")

# This creates a new tensor; it does not reshape the variable.
reshaped_variable = tf.reshape(variable,[1,4])
print("reshaped-variable: ",reshaped_variable)
print("----------------------------------------")

# we cannot able to reshape the variable greater than the no of elements in the original variable
exception_variable = tf.reshape(variable, [1,5])



