export interface Template {
    /**
     * unique id (GUID) of the template
     * @TJS-type string
     */
    guid: string;

    /**
     * Static name; think radio button groups
     */
    name: string;

    /**
     * title of the element in a multi-lang array
     * @TJS-type Title
     */
    title: Title;

    /**
     * if the questionnaire\template is read-only due to the state of the object in dyanmics 
     * @TJS-type boolean
     */
    readOnly: boolean;

    /**
     * list of objects representing all the associated provisions of this template
     * and the questions those provisions are linked to 
     * @TJS-type SearchableProvision
     * @nullable
     */
    searchableProvisions: SearchableProvision[];

    /**
     * GUID ID OF GROUP LAST EDITED
     * @nullable
     */
    lastEditedGroup: string;

    /**
     * list of objects representing groupings of questions in this Template
     * @TJS-type Group
     */
    groups: Group[];
}

export interface Group {
    /**
     * unique id (GUID) of the template
     * @TJS-type string
     */
    guid: string;

    /**
     * Static name; think radio button groups
     */
    name: string;

    /**
     * title of the element in a multi-lang array
     * @TJS-type Title
     */
    title: Title;

    /**
     * represents if this group can be repeated by user
     */
    isRepeatable: boolean;

    /**
     * if this group is visible by default 
     * 
     * having a value of false would assume that this group has been included
     * in a DependencyGroup of a Question which decribes the logic
     * used to hide or show this group
     */
    isVisibleByDefault: boolean;

    /**
     * order in which this group appears in a set of groups of a template
     */
    sortOrder: number;

    /**
     * suffix used to create unique html element ids
     * when repeating groups 
     */
    domSuffix: string;

    /**
     * unique ID for html element id 
     */
    domId: string;

    /**
     * the set of Questions that belong to this group
     */
    questions: Question[];
}

export interface Question {
    /**
     * unique id (GUID) of the template
     * @TJS-type string
     */
    guid: string;

    /**
     * Static name; think radio button groups
     */
    name: string;

    /**
     * order in which this group appears in a set of groups of a template
     */
    sortOrder: number;

    /**
     * if this question is visible by default 
     * 
     * having a value of false would assume that this question has been included
     * in a DependencyGroup of another Question to decribes the logic
     * used to hide or show this question
     */
    isVisibleByDefault: boolean;

    /**
     * text of the question in a multi-lang array
     * @TJS-type Title
     */
    text: Title;

    /**
     * what type of question is this
     * @TJS-type string
     */
    type: QuestionResponseType;

    //===========================================================
    /** @nullable */
    response: string[] | number | null | string;

    isSamplingAllowed: boolean;

    /** @nullable */
    samplingRecord?: SamplingRecord;

    /**
     * represents if this element CAN be repeated by user
     */
    isRepeatable: boolean;

    /**
     * represents if this element HAS been repeated by user
     */
    isRepeated: boolean;

    /**
     * only radio and select have resonse options...currently - 
     * TODO: every type of Question should have them
     * @nullable 
     */
    responseOptions: ResponseOption[];

    /**
     * array of rules describing what is required for the response 
     * of this question to be valid
     */
    validationRules: ValidationRule[];

    violationInfo: ViolationInfo;

    /**
     * child or sub-questions
     */
    questions: Question[];

    /**
     * the result of this question can affect the
     * -question requirement, 
     * -enabling of a ValidationRule, or 
     * -setting the value of what a validationRule should validate against
     * for other questions
     * 
     * having a dependant also means that this question is included inside 
     * a dependencyGroup of that question
     * @default []
     */
    dependants: Dependant[];

    /**
     * the
     * -question requirement, 
     * -enabling of a ValidationRule, or 
     * -setting the value of what a validationRule should validate against
     * for this question can be dependent on other questions as described in 
     * the DependencyGroups of this array
     * */
    dependencyGroups: DependencyGroup[];

    /** represents the state of validation for a question
     * maybe long could make computed, but working
     */
    validationState: boolean;

    /**
     * ============================================================
     */
    result: Result;
}

export interface Dependant {
    guid: string;
}

export interface DependencyGroup {
    ruleType: DependencyGroupType;

    /** @nullable */
    childValidatorName: string;
    questionDependencies: DependencyGroupItem[]
}

export interface DependencyGroupItem {
    dependsOnQuestion: Dependant;

    /** @nullable */
    validationAction: ComparisonOperator;
    validationValue: string;
}

export interface Comment {
    option: Option;
    value: string;
}

export interface ResponseOption {
    guid: string;
    name: string;
    sortOrder: number;
    text: Title;
    value: string;
    internalCommentRequirement: string;
    externalCommentRequirement: string;
    fileRequirement: string;
    pictureRequirement: string;
    provisions: string[];
    //selectedProvisions: any[];
}

export interface Picture {
    option: Option;
    value: PictureItem[];
    validationStatus?: boolean;
    notification?: null;
}

export interface PictureItem {
    base64String: string;
    title: string;
    comment: string;
    timeStamp: Date;
}

export interface File {
    option: Option;
    value: any[];
}

export interface FileItem {
    base64String: string;
    title: string;
    comment: string;
    timeStamp: Date;
}

export interface Title {
    en: string;
    fr: string;
}

export interface ValidationRule {
    name: ValidationRuleType;
    enabled: boolean;
    type: ValidationRuleType;

    /** @nullable */
    value: string | number | null;
    errorMessage: Title;
}

export interface ViolationInfo {
    referenceID: null;
    violationCount: null;
}

export interface SamplingRecord {
    approximateTotal: string;
    sampleSize: string;
    nonCompliances: string;
}

export interface SearchableProvision {
    leg: string;
    questions: string[];
}

export enum QuestionResponseType {
    Reference = "reference",
    Image = "image",
    Number = "number",
    Select = "select",
    Radio = "radio",
    Text = "text",
}

export enum ComparisonOperator {
    Equal = "equal",
    NotEqual = "notEqual",
    GreaterThen = "greaterThen",
    LessThen = "lessThen",
    LengthLessThen = "lengthLessThen",
    LengthGreaterThen = "lengthGreaterThen",
}

export enum ValidationRuleType {
    Require = "require",
    Min = "min",
    Max = "max",
    MinLength = "minLength",
    MaxLength = "maxLength",
}

export enum Option {
    Optional = "optional",
    Required = "required",
    NA = "n/a"
}

export enum DependencyGroupType {
    Visibility = "visibility",
    Validation = "validation",
    ValidationValue = "validationValue"
}

export interface Result {
    value: string;
    selectedResponse: number;
    externalComment: string;
    internalComment: string;
    violationInfo: ViolationInfo;
    samplingRecord: SamplingRecord;
}