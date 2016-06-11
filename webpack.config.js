module.exports = {
  entry: "./src/main",
  output: {
    path: "app/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel" },
      { test: /\.css$/, loader: "style!css" }
    ]
  }
}
