graphsEditor
    -> isDragNewItemFromMenu
    -> itemNodeSelected

    -> itemNodes
        -> itemNode
            -> id
            -> itemTypeID
            -> position
            -> inputNodes
                -> inputNode
                    -> dataTypeID
                    -> relativePosition
                    -> sourceNodeID
                    -> connectingLine
                    
                    -> getDescription()
                    -> getSourceNodePosition() 
                    -> onMouseEnter()
                    -> connectIONodes()
            -> outputNodes
                -> outputNode
                    -> dataTypeID
                    -> relativePosition
                    -> destinationNodes
                        -> destinationNodeID
                        -> destinationNodeID
                    -> connectingLine

                    -> getDescription()
                    -> getDestinationNodePosition()
                    -> onMouseEnter()
                    -> connectIONodes()
            -> getTitle()
            -> getDescription()
            -> select()
            -> drag()
            -> run()
        -> itemNode
        -> itemNode

    -> connectingLines
        -> connectingLine
            -> select()
            -> delete()

    
