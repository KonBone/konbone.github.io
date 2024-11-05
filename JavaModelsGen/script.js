class ClassRepr {
    constructor(name = "Unnamed" + ClassRepr.a) {
        this.name = name
        this.fields = {};
        this.otherClasses = [];
    }
    
    static a = 0;

    static convert(json) {
        let repr = new ClassRepr();
        ClassRepr.a++;
        repr.recursiveConvert(json);
        return repr;
    }

    convertObjectsToJavaType(obj) {
        let type = typeof obj;
        if (type == typeof '') return 'String';
        else if (type == typeof 1) 
            if (Number.isInteger(obj)) return 'long';
            else return 'float';
        else if (type == typeof true) return 'boolean';
        else if (obj == null) return 'Object';
        else if (Array.isArray(obj)) {
            const repr = ClassRepr.convert(obj);
            this.otherClasses.push(repr);
            return `List<${repr.name}>`;
        }
        else if (type == 'object') {
            let repr = ClassRepr.convert(obj);
            this.otherClasses.push(repr);
            return repr.name;
        }
        else return '?';
    }

    static mergeReprs(repr1, repr2) {
        const repr = new ClassRepr(repr1.name);
        return repr;
    }

    recursiveConvert(model) {
        if (Array.isArray(model)) {
            const reprs = [];
            for (const m of model) reprs.push(ClassRepr.convert);
            return reprs.reduce(ClassRepr.mergeReprs)
        }
        for (const [key, value] of Object.entries(model)) {
            this.fields[key] = this.convertObjectsToJavaType(value);
        }
    }
}

var testModel = {
    a: 1, b: 1.1, c: true, d: '', e: [123, 123], f: null, g: {a: 123}, h: [{a: 1}, {b: 2}]
};

function transform() {
    let model = document.querySelector('#model');
    let modelName = document.querySelector('#model_name');
    model.value = '{}';
    model = JSON.parse(model.value);
    modelName = modelName.value;
    let code = document.querySelector('#code');
    let classRepr = ClassRepr.convert(testModel);
    console.log(testModel);
    console.log(classRepr);
    // let modelRepr = generateModelRepr(model);
    code.innerText = generateText(classRepr.fields, classRepr.name);
}

function generateText(modelRepr, modelName) {
    let res = 'public class ' + modelName + ' extends Model {\n';
    for (const [key, value] of Object.entries(modelRepr)) {
        res += '\t';
        res += `public ${value} ${key};`;
        res += '\n';
    }
    return res + '}';
}

class ModelRepr {
    constructor(name) {
        this.name = name;
        this.fields = {};
        this.reprs = [];
    }
    
    static getTypeOf(value) {
        let type = typeof value;
        if (value == null) return ['?', '?'];
        else if (type == typeof '') return ['String', 'String'];
        else if (type == typeof 1) 
            if (Number.isInteger(value)) return ['long', 'Long'];
            else return ['double', 'Double'];
        else if (type == typeof true) return ['boolean', 'Boolean'];
        else if (Array.isArray(value)) return ['List', 'List'];
        else if (type == 'object') return ['Object', 'Object'];
        else return ['?', '?'];
    }

    convertList(listOfModels) {
        
    }

    convert(model) {
        
    }
}