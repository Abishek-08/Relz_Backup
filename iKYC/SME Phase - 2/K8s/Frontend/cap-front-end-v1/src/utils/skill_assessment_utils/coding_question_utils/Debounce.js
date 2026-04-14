export function debounce(fun, wait){
    let timeout;
    return function(...args){
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => fun.apply(context, args), wait);
    };
}