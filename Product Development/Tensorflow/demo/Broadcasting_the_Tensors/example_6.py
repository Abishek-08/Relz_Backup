import tensorflow as tf

a = tf.constant([
    [1],
    [2],
    [3]
])

b = tf.constant([10,20,30,40])

result = a + b


print("First tensor: ",a)
print("Second tensor: ",b)

print("Result: ",result)