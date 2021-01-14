export interface Template {
    name:                 string;
    title:                Title;
    groups:               Group[];
    templateid:           string;
    searchableProvisions: SearchableProvision[];
    readOnly:             boolean;
}

export interface Group {
    primaryKey:      string;
    title:           Title;
    isRepeatable:    boolean;
    isVisible:       boolean;
    order:           number;
    questions:       Question[];
    domSuffix:       string;
    htmlElementId:   string;
    expansionPanels: number[]; // shouldnt be here
}

export interface Question {
    name:               string;
    id:                 number;
    guid:               string;
    sortOrder:          number;
    isVisible:          boolean;
    isMultiple:         boolean;
    text:               Title;
    type:               QuestionResponseType;
    response:           null;
    isSamplingAllowed?: boolean;
    samplingRecord?:    SamplingRecord | null;
    isRepeatable?:      boolean;
    isRepeated?:        boolean;
    responseOptions:    QuestionResponseOption[];
    validationRules:    ValidationRule[];
    violationInfo:      ViolationInfo;
    childQuestions:     Question[];
    dependants:         string[];
    dependencyGroups:   DependencyGroup[];
}

export interface DependencyGroup {
    ruleType:             DependencyGroupType;
    childValidatorName:   null;
    questionDependencies: QuestionDependency[];
}

export interface QuestionDependency {
    dependsOnQuestionId: string;
    validationAction:    ComparisonOperator | null;
    validationValue:     string;
}

export interface Comment {
    option: Option;
    value:  string;
}

export interface Title {
    en: string;
    fr: string;
}

export interface ValidationRule {
    name:         string;
    enabled:      boolean;
    type:         ValidationRuleType;
    value:        null | string;
    errorMessage: Title;
}

export interface ViolationInfo {
    responseToMatch: string;
    matchingType:    ComparisonOperator;
}

export interface QuestionResponseOption {
    id:                        number;
    sortOrder:                 number;
    text:                      Title;
    value:                     string;
    internalComment:           Comment;
    externalComment:           Comment;
    picture:                   Picture[];
    provisions:                string[];
    selectedProvisions:        any[];
    searchProvisions:          null;
    isProvisionCollapsed:      boolean;
    name:                      string;
    selectedProvisionsTitles?: any[];
}

export interface PictureSupplimentaryInfo {
    option:   Option;
    pictures: Picture[];
}

export interface Picture {
    title:       string;
    description: string;
    base64Value: string;
}

export interface SamplingRecord {
    approximateTotal: string;
    sampleSize:       string;
    nonCompliances:   string;
}

export interface SearchableProvision {
    legislationId:  string;
    questionIds:      string[];
}

export enum QuestionResponseType {
    Reference = "Reference",
    Image     = "Image",
    Number    = "Number",
    Select    = "Select",
    Radio     = "Radio",
    Text      = "Text",
}

export enum ComparisonOperator {
    Equal             = "equal",
    NotEqual          = "notEqual",
    GreaterThen       = "greaterThen",
    LessThen          = "lessThen",
    LengthLessThen    = "lengthLessThen",
    LengthGreaterThen = "lengthGreaterThen",
}

export enum ValidationRuleType {
    Require   = "require",
    Min       = "min",
    Max       = "max",
    MinLength = "minLength",
    MaxLength = "maxLength",
}

export enum Option {
    Optional = "optional",
    Required = "required",
    NA       = "n/a"
}

export enum DependencyGroupType {
    Visibility      = "visibility",
    Validation      = "validation",
    ValidationValue = "validationValue"
}