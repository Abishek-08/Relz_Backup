import tensorflow as tf
import numpy as np

original_tensor = tf.constant([[4.0, 5.0], [10.0, 1.0]])

# Find the largest number in the tensor
largest_num = tf.reduce_max(original_tensor)
print("Largest Num: ",largest_num.numpy())

# Find the largest number index in the tensor
largest_num_index = tf.math.argmax(original_tensor)
print("Largest Index Num: ",np.array(largest_num_index))

# Compute the softmax
softmax = tf.nn.softmax(original_tensor)
print(softmax)


# working principle of the softmax:
# ---------------------------------------
# By default, tf.nn.softmax() applies softmax row-wise (i.e., along axis=-1, the last axis), meaning each row becomes a probability distribution.
# -------------------------------------------------------------------------------------------------------------------------------------------------------------
# Compute Softmax Manually

# Let’s compute each row's softmax manually:
# Row 1: [4.0, 5.0]
# softmax(x)=ex∑ex
# softmax(x)=∑exex​
# e4.0≈54.60,e5.0≈148.41
# e4.0≈54.60,e5.0≈148.41
# Sum=54.60+148.41≈203.01
# Sum=54.60+148.41≈203.01
# Softmax=[54.60/203.01,148.41/203.01]≈[0.269,0.731]
# Softmax=[54.60/203.01,148.41/203.01]≈[0.269,0.731]
# Row 2: [10.0, 1.0]
# e10.0≈22026.47,e1.0≈2.718
# e10.0≈22026.47,e1.0≈2.718
# Sum=22026.47+2.718≈22029.19
# Sum=22026.47+2.718≈22029.19
# Softmax=[22026.47/22029.19,2.718/22029.19]≈[0.999877,0.000123]
# Softmax=[22026.47/22029.19,2.718/22029.19]≈[0.999877,0.000123]

# --------------------------------------------------------------------------------------------
# Final Output

# So the softmax output will be:

# tf.Tensor(
# [[0.26894143 0.7310586 ]
#  [0.9998766  0.00012341]], shape=(2, 2), dtype=float32)
# ----------------------------------------------------------------------------------------------------
# Interpretation

#     In the first row, the value 5.0 is more "confidently chosen" → 73.1% probability.

#     In the second row, 10.0 dominates → ~99.99% probability, nearly certain.





# Summary:
# --------------------------
# Feature	Explanation
# What it does -> Turns numbers into probabilities
# Output range -> Between 0 and 1
# Output sum   -> Always equals 1
# Common usage -> Final layer in classification models

print("\n\n********Convert_to_Tensor_example**************")
# ------------------------------------------*****************------------------------------------------------------------------
# Note: Typically, anywhere a TensorFlow function expects a Tensor as input, the function will also accept anything that can be converted to a Tensor using tf.convert_to_tensor. 
# See below for an example.

# example-1:
converted_tensor = tf.convert_to_tensor([1,2,3,4])
print("\nConverted tensor: ",converted_tensor)

# example-2 :
con_max = tf.reduce_max(np.array([10,20,30,40]))
print("Find max nums: ",con_max)
print("Dimensions: ",converted_tensor.ndim)


# ---------------------------------------------------------------------------------------------------
print("\n******************casting******************************")
the_f64_tensor = tf.constant([2.2, 3.3, 4.4], dtype=tf.float64)
the_f16_tensor = tf.cast(the_f64_tensor, dtype=tf.float16)
# Now, cast to an uint8 and lose the decimal precision
the_u8_tensor = tf.cast(the_f16_tensor, dtype=tf.uint8)
print("casted tensors: ",the_u8_tensor)