import numpy as np
import faiss
 
class FaceMatcher:
    def __init__(self, known_embeddings, identities):
        self.index = faiss.IndexFlatL2(known_embeddings.shape[1])
        self.index.add(known_embeddings.astype(np.float32))
        self.identities = identities
 
    def match(self, embedding, k=1):
        distances, indices = self.index.search(embedding.astype(np.float32), k)
        return self.identities[indices[0][0]], distances[0][0]