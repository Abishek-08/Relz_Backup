import tensorflow as tf

# String Tensors
# tf.string is a dtype, which is to say you can represent data as strings (variable-length byte arrays) in tensors.
# The strings are atomic and cannot be indexed the way Python strings are. The length of the string is not one of the axes of the tensor. 
string_tensor_0D = tf.constant("string")

string_tensor_1D = tf.constant(["Gray wolf",
                                "Quick brown fox",
                                "Lazy dog"])
# In the above printout the b prefix indicates that tf.string dtype is not a unicode string, but a byte-string. 

# If you pass unicode characters they are utf-8 encoded.
emoji_string_tensor = tf.constant("🥳👍")


print("---------------------------------------")
print("0D-String-Tensor: ", string_tensor_0D)
print("Shape of 0D: ",string_tensor_0D.shape)
print("---------------------------------------")
print("1D-String-Tensor: ",string_tensor_1D)
print("shape of 1D: ",string_tensor_1D.shape)
print("---------------------------------------")
print("Emoji_String_tensor: ",emoji_string_tensor)
print("Shape of Emoji: ",emoji_string_tensor.shape)


print("------------------------------------------")

# Basic Functions using string tensors
splited_1D_tensor = tf.strings.split(string_tensor_1D,sep=" ")

# ...but it turns into a `RaggedTensor` if you split up a tensor of strings,
# as each string might be split into a different number of parts.
print(splited_1D_tensor)

# Convert string into number
string_number_tensor = tf.constant(["1 10 30"])
print("---------------------------------------------------")
print("String-Number-Tensor: ",string_number_tensor)
splited_number_tensor = tf.strings.split(string_number_tensor,sep=" ")
print("splited-Number-Tensor: ",splited_number_tensor)
string_to_number_tensor = tf.strings.to_number(splited_number_tensor)
print("Converted Number Tensor: ",string_to_number_tensor)


print("-------------------------------------------------")
# Convert String into bytes and then into number
original_string = tf.constant("Duck")
print("Original-String: ",original_string)
split_to_byte_string = tf.strings.bytes_split(original_string)
print("Splited-Byte-String: ",split_to_byte_string)
byte_ints = tf.io.decode_raw(split_to_byte_string, tf.uint8)
print("Byte Number for the String input: ",byte_ints)

print("*****************Alternative Method*****************************")
unicode_string = tf.constant("Duck 🦆")
print("unicode-String: ",unicode_string)
split_unicode_string = tf.strings.unicode_split(unicode_string, "UTF-8")
print("split-unicode-string: ",split_unicode_string)
decoded_unicode_string = tf.strings.unicode_decode(unicode_string, "UTF-8")
print("Decoded-unicode-string: ",decoded_unicode_string)
