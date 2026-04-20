import tensorflow as tf


print("---------------------------------------------------------------")
# ******************************Declare the variable in the CPU and GPU******************************************

# For better performance, TensorFlow will attempt to place tensors and variables on the fastest device compatible with its dtype. 
# This means most variables are placed on a GPU if one is available.


# However, you can override this. 
# In this snippet, place a float tensor and a variable on the CPU, even if a GPU is available. 
# By turning on device placement logging (see Setup), you can see where the variable is placed.


# Below operations are take place only in the cpu of the device not in other devices.
with tf.device("CPU:0"):
    variable = tf.Variable([[1.0,2.0,3.0],[4.0,5.0,6.0]])
    tensor = tf.constant([[1.0,2.0],[3.0,4.0],[5.0,6.0]])
    result = tf.matmul(variable,tensor)

    print("CPU-Final Result: ",result)


print("---------------------------------------------------------------------")

# It's possible to set the location of a variable or tensor on one device and do the computation on another device. 
# This will introduce delay, as data needs to be copied between the devices.
# You might do this, however, if you had multiple GPU workers but only want one copy of the variables.

with tf.device("CPU:0"):
    a = tf.Variable([[1.0,2.0,3.0],[4.0,5.0,6.0]])
    b = tf.Variable([[1.0,2.0,3.0]])

with tf.device("GPU:0"):
    # Element-wise operations
    c = a + b

    print("CPU+GPU Final Result: ",c)