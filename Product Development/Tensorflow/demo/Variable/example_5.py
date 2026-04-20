import tensorflow as tf

# Variable names are preserved when saving and loading models. 
# By default, variables in models will acquire unique variable names automatically, so you don't need to assign them yourself unless you want to.

# Although variables are important for differentiation, some variables will not need to be differentiated. 
# You can turn off gradients for a variable by setting trainable to false at creation. 
# An example of a variable that would not need gradients is a training step counter.

print("--------------------------------------------------------------")
turned_of_gradients_variable = tf.Variable("variable", trainable=False)
print("Turned-Off-Gradient-variable: ", turned_of_gradients_variable)