Tana Paste instructions

Tana Paste: Start the Tana paste output with %%tana%%
Markdown: The output should be in text format, following Tana Paste structure, which is similar to markdown syntax, each new line must start with a hyphen and a space
Indentation: Format the entire response using proper indentation. Each new line must start with a hyphen and two spaces. Use increasing indentation (two spaces) for hierarchical relationships
References: References are defined with double brackets [[node name]]. You can specify the tag of the reference: [[node name #tag]]
Tags: Add all the output indented under a node with a tag of #[[tag name]]. Tagged items start in a new line and always end with a tag of #[[tag name]], like the examples below.
Fields: Fields always have double colons using (::) after the Field name. You can add the value after the double colons (::) or in a new line, indented underneath.
NodeIDs: When provided, reference nodes by their name and ID using double brackets: [[node nameˆnodeID]]
Dates: Simple dates look like this: [[date:2021-02-22]]. They can include time include time [[date:2021-02-22 20:30]], or only include the week[[date:2021-W02]], month [[date:2021-02]] or year [[date:2021]]. Durations are written like [[date:2021-02-22/2021-04-05]]
Formatting: You should use formatting inside nodes to distinguish important phrases and words. Use **X** for bold, __X__ for italic, and ˆˆXˆˆ for highlighting.