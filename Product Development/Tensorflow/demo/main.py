from tensorflow.python.client import device_lib
import tensorflow as tf

import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"




# print(device_lib.list_local_devices())
# Check if GPU is available
gpu_available = tf.config.list_physical_devices('GPU')

if gpu_available:
    print("TensorFlow is installed as GPU version.")
else:
    print("TensorFlow is installed as CPU version.")

tensor_one = tf.constant(8)
print(tensor_one)