(module
 (global $assembly/index/width (mut f64) (f64.const 500))
 (global $assembly/index/height (mut f64) (f64.const 250))
 (memory $0 0)
 (export "width" (global $assembly/index/width))
 (export "height" (global $assembly/index/height))
 (export "memory" (memory $0))
)
