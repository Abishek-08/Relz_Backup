import tensorflow as tf

# Indexing start at zero
# (-ve) value indices counts backward from the end
# colons ":" are used for slice:start:stop:step

rank_1_tensor = tf.constant([1,2,3,4])

print("--------------------------------------------")
print("Original Tensor: ")
print(rank_1_tensor)

# Indexing and Slicing operations in rank_1_tensors

# Printing all the value in tensor
print("--------------------------------------------")
print("It will print the all the value in tensor: ")
print(rank_1_tensor[:])


# Printing the value in certain index
print("--------------------------------------------")
print("value at 0-index: ",rank_1_tensor[0].numpy())
print("value at 3-index", rank_1_tensor[3].numpy())
print("value at -1 index: ",rank_1_tensor[-1].numpy())
print("value at -3 index: ",rank_1_tensor[-3].numpy())

# Printing the value in certain range
# [start_index:end_index+1]
print("-------------------------------------------")
print("Print the values in certain ranges: ")
print("range between [0:2]: ",rank_1_tensor[0:2].numpy())
print("range between [:4]: ",rank_1_tensor[:4].numpy())
print("range between [:3]: ",rank_1_tensor[:3].numpy())
print("range between [1:]: ",rank_1_tensor[1:].numpy())

# Printing the values from backward directions
print("\n*******Backward-Indexing*********")
print("range b/w [-3:-1]: ",rank_1_tensor[-3:-1].numpy())
print("range b/w [-1:]: ",rank_1_tensor[-1:].numpy())
print("range b/w [-2:]: ",rank_1_tensor[-3:].numpy())
print("range b/w [:-2]: ",rank_1_tensor[:-2].numpy())
print("range b/w [:-3]: ",rank_1_tensor[:-3].numpy())