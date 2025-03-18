import promisePool from '../config/database.js';

const deleteInternCtrl = {
    deleteIntern: async(req,res)=>{
        try{
            const { internID } = req.params;
            if(!internID) {
                return res.status(400).json({message: 'Intern ID is required'});
            }

            const deleteInternQuery = `
            DELETE FROM bizznestflow2.interns WHERE InternID = ?`;
            const [result] = await promisePool.execute(deleteInternQuery, [internID]);

            if(result.affectedRows === 0){
                return res.status(400).json({message : 'Intern not found'})
            }
            res.status(200).json({message: "Intern deleted successfully"})
        }catch(error){ 
            console.error('Error deleting intern', error.message);
            res.status(500).json({message : 'Error deleting Intern'})

        }
    },
}

export default deleteInternCtrl;