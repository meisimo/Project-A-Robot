class VillageState{
    constructor(place, parcels){
        this.place = place;
        this.parcels = parcels;
    }
    static internalGraph( graph ){
        VillageState.prototype["roadGraph"] = graph;
    }
    move( destination ){
        if( !this.roadGraph.areAdjacents( this.place, destination ) ) 
            return this;
        let parcels = this.parcels.map( p=>{
            return (( p.place != this.place )? 
                                p : 
                                {place:destination,address:p.address});
        }).filter( p =>{
            p.address != destination;
        });
        return new VillageState( destination, parcels);
    }
}

/**
 * This build an undirected graph over an adjacency list struct
 */
class undirGraph{

    /**
     * Is the format of the adjacencies in a string
     * @callback adjStringFromat
     * @param {string}  adj - String with the format of an adjs
     * @return {Object[]}  An array with the adjacent vertex
     * @example 
     * // return [4,5]
     * "4-5".split("-");
     */

    /**
     * This is a function to process a node
     * @callback processNode
     * @param   {*} node - Node of the graph
     * @return  {void}
     */

   /**
    * This build an empty undirected graph over an adjacency list struct
    * @param {void}
    */ 
    constructor(){
        this.nodesHash  = new Map();
        this.nodes      = [];
        this.adjs       = [];
    }
    /**
     * Build the adjs of the graph. 
     * @param {string[]} adjs - Array of strings with the specifyc format to get the adjacent vertex from each element
     * @param {adjStringFromat} format
     * @return {void}
     */
    buildHoleGraph(adjs, format){
        for(let adj of adjs)
            this.addEdge( ...format(adj) );
    }
    /**
     * Add an adjacen to the adjacenci list
     * @param {*} a - a adjacent to b
     * @param {*} b - b adjacent to a
     * @return {void}
     */
    addEdge( a, b){
        if( !this.nodesHash.has(a) ){
            this.nodes.push( a );
            this.nodesHash.set( a, this.nodesHash.size );
        }
        if( !this.nodesHash.has(b) ){
            this.nodes.push( b );
            this.nodesHash.set( b, this.nodesHash.size );
        }

        a = this.nodesHash.get(a);
        b = this.nodesHash.get(b);
        
        if( a in this.adjs )    this.adjs[a].push(b);
        else                    this.adjs[a] = [b];

        if( b in this.adjs )    this.adjs[b].push(a);
        else                    this.adjs[b] = [a];
    }
    /**
     * Run a dfs and process each node with a spacified function
     * @param {*} [start=null] - The first node of the graph. Default value starts the dfs from the zero node
     * @param {processNode} [process=console.log]
     * @return {void}
     */
    dfs( start=null, process = console.log ){
        const innerDfs = nodeNum => {
            process(this.nodes[nodeNum]);
            visited[nodeNum] = true;

            for(let n of this.adjs[nodeNum])
                if( !visited[n] )
                    innerDfs(n);
        }

        let visited = new Array( this.nodesHash.size );
        
        if( start !== null)
            start = this.nodesHash.get(start)
        else 
            start = 0;
        
        innerDfs(start);
    }
    /**
     * Check if two nodes are adjacents in the graph
     * @param {*} a - A node of the graph
     * @param {*} b - B node of the graph
     * @return {boolean}  true <-> nodes are adjacents
     */
    areAdjacents( a, b ){
        return this.adjs[ this.nodesHash.get(a) ].includes(this.nodesHash.get( b ));
    }
}

const runRobot = function( state, robot, memory){
    let turn = 0;
    while(true){
        if( state.parcels.length==0 ){
            console.log(`Done in ${turn} turns`);
            break;
        }
        let plan = robot( state, memory );
        
        state = state.move( plan.direction );
        memory = plan.memory;

        console.log(`Moved to ${plan.diection}`);

        turn++;
    }
}

const robotProject = function(){
    const roads = [
        "Alice's House-Bob's House",   "Alice's House-Cabin",
        "Alice's House-Post Office",   "Bob's House-Town Hall",
        "Daria's House-Ernie's House", "Daria's House-Town Hall",
        "Ernie's House-Grete's House", "Grete's House-Farm",
        "Grete's House-Shop",          "Marketplace-Farm",
        "Marketplace-Post Office",     "Marketplace-Shop",
        "Marketplace-Town Hall",       "Shop-Town Hall"
      ];
    
    const roadGraph = new undirGraph();
    roadGraph.buildHoleGraph( roads, adj => adj.split("-") )

    VillageState.internalGraph( roadGraph );

    roadGraph.dfs();

    let first = new VillageState(
        "Post Office",
        [{place: "Post Office", address: "Alice's House"}]
      );


    let next = first.move("Alice's House");
    
    console.log(next.place);
    console.log(next.parcels);
    console.log(first.place);

}

robotProject();

//window.addEventListener("load", robotProject);