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

    
klik n drag dari node input ke node output atau sebaliknya :
1. klik n drag ioNode
    - isDraggingNewConnectingLine = true
    - set sourceNodeGlobalPosition
2. catet titik awal
3. drag
4. dragend, jika mouseover pada ioNode yang sesuai, connect():
    - set destinationNodeGlobalPosition
	- buat connectingLine, dengan posisi awal node asal, posisi akhir node tujuan
        - buat quadratic bezier
	- daftarkan connectingLine pada ioNode asal dan ioNode tujuan
        - daftarkan ioNode tujuan pada ioNode asal
        - daftarkan ioNode asal pada ioNode tujuan
        - beri fungsi on click pada connectingLine, untuk menghapus dengan key delete
    - pada on drag itemNode :
        - cek tiap ioNode, apakah punya connectingLine
        - update posisi connectingLine sesuai perubahan posisi itemNode
        
    - isDraggingNewConnectingLine = false
    - unset sourceNodeGlobalPosition
    - unset destinationNodeGlobalPosition
