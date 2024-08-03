import pandas as pd
from sklearn.decomposition import PCA
import numpy as np
import matplotlib.pyplot as plt

# Load the dataset
df = pd.read_csv('./colorimetry_dataset.csv')

# Extract and preprocess the RGB values
rgb_values = df['RGB Values'].str.extract(r'\((\d+), (\d+), (\d+)\)').astype(int)
rgb_values.columns = ['R', 'G', 'B']

# Apply PCA
pca = PCA(n_components=2)
pca_result = pca.fit_transform(rgb_values)

# Add PCA results to the dataframe
df['PCA1'] = pca_result[:, 0]
df['PCA2'] = pca_result[:, 1]

# Plot the PCA results
plt.figure(figsize=(10, 7))
plt.scatter(df['PCA1'], df['PCA2'], c='blue', edgecolor='k')
for i, txt in enumerate(df['Sample ID']):
    plt.annotate(txt, (df['PCA1'][i], df['PCA2'][i]))

plt.xlabel('PCA1')
plt.ylabel('PCA2')
plt.title('PCA of RGB Values')
plt.grid(True)
plt.show()

df[['Sample ID', 'RGB Values', 'PCA1', 'PCA2']]
