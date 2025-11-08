# Data Model Details

```mermaid
classDiagram
  class Material {
    string id
    string name
    string location
    string imageUri
    Color[] colors
    number createdAt
    number updatedAt
    string notes
  }
  class Color {
    string hex
    number r
    number g
    number b
    string name
  }
```

- `id`: UUID v4
- `colors`: up to 5 dominant colors per image. `name` is a human/AI label when available.

## SQLite Schema (Initial)
- materials(id TEXT PRIMARY KEY, name TEXT, location TEXT, imageUri TEXT, colors TEXT, createdAt INTEGER, updatedAt INTEGER, notes TEXT)

`colors` stored as JSON string for simplicity.
